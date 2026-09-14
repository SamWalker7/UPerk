const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Compile these small TS modules in memory; no external test runner or artifacts.
const cache = new Map();
function load(relativePath) {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  const localRequire = name => {
    if (name === './forms' || name === '@/lib/forms') return load('src/lib/forms.ts');
    if (name === './jobs') return load('src/lib/jobs.ts');
    if (name === '@/lib/careers') return load('src/lib/careers.ts');
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  cache.set(relativePath, module.exports);
  return module.exports;
}

const { validateApplication, applicationPayload } = load('src/lib/careers.ts');
const { POST } = load('src/app/api/careers/route.ts');
const applicant = {
  firstName: ' Alex ', lastName: ' Test ', email: 'alex@example.com', location: 'Tysons, VA',
  role: 'Developer', workLocation: 'Remote', experience: '4-6 years', availability: 'Within 1 month',
  engagement: 'Full-time', skills: 'TypeScript, React, accessible interfaces', project: 'Built an accessible scheduling experience.',
  consent: true,
};
const request = data => new Request('http://localhost/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost' }, body: JSON.stringify(data) });

test('required fields validate independently of optional websites and social profiles', () => {
  const result = validateApplication(applicant);
  assert.deepEqual(result.errors, {});
  assert.equal(result.values.firstName, 'Alex');
  assert.deepEqual(result.socialProfiles, []);
  const invalid = validateApplication({ ...applicant, lastName: ' ', consent: false, role: 'Unsupported' });
  assert.ok(invalid.errors.lastName);
  assert.ok(invalid.errors.consent);
  assert.ok(invalid.errors.role);
});

test('URL and social validation rejects unsafe protocols, duplicates, and malformed data', () => {
  const result = validateApplication({ ...applicant, website: 'javascript:alert(1)', resumeUrl: 'file:///resume.pdf', socialProfiles: [{ platform: 'LinkedIn', handle: 'alex' }, { platform: 'LinkedIn', handle: 'duplicate' }] });
  assert.ok(result.errors.website);
  assert.ok(result.errors.resumeUrl);
  assert.ok(result.errors.socialProfiles);
  assert.ok(validateApplication({ ...applicant, socialProfiles: [null] }).errors.socialProfiles);
  assert.ok(validateApplication({ ...applicant, skills: 'x'.repeat(3001) }).errors.skills);
});

test('payload retains all applicant details in the established endpoint schema', () => {
  const result = validateApplication({ ...applicant, website: 'https://example.com', resumeUrl: 'https://example.com/resume.pdf', socialProfiles: [{ platform: 'LinkedIn', handle: 'alex-test' }] });
  const payload = applicationPayload(result.values, result.socialProfiles);
  assert.deepEqual(Object.keys(payload), ['projectDetails', 'timelineAndBudget', 'contactInfo']);
  assert.equal(payload.contactInfo.fullName, 'Alex Test');
  assert.equal(payload.projectDetails.projectType, 'Career Application');
  assert.match(payload.projectDetails.projectDescription, /resume\.pdf/);
  assert.match(payload.projectDetails.projectDescription, /LinkedIn: alex-test/);
  assert.match(payload.projectDetails.projectDescription, /TypeScript, React/);
});

test('job selections and attachment links validate and reach the delivery summary', () => {
  const result = validateApplication({ ...applicant, jobId: 'full-stack-developer', attachments: [{ label: 'Work sample', url: 'https://drive.google.com/file/d/example/view' }] });
  assert.deepEqual(result.errors, {});
  const payload = applicationPayload(result.values, result.socialProfiles, result.attachments);
  assert.match(payload.projectDetails.projectDescription, /Opening ID: full-stack-developer/);
  assert.match(payload.projectDetails.projectDescription, /Work sample: https:\/\/drive.google.com/);
  assert.ok(validateApplication({ ...applicant, jobId: 'ux-designer' }).errors.role);
  assert.ok(validateApplication({ ...applicant, attachments: [{ label: 'CV', url: 'javascript:alert(1)' }] }).errors.attachments);
  assert.ok(validateApplication({ ...applicant, attachments: [null] }).errors.attachments);
  assert.deepEqual(validateApplication({ ...applicant, attachments: [{ label: '', url: '' }] }).attachments, []);
});

test('invalid, cross-origin, oversized and bot submissions never reach AWS', async () => {
  const previous = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls++; throw new Error('Unexpected delivery'); };
  try {
    assert.equal((await POST(request({}))).status, 422);
    assert.equal((await POST(request({ ...applicant, companyWebsite: 'spam' }))).status, 400);
    assert.equal((await POST(request({ ...applicant, skills: 'x'.repeat(70000) }))).status, 413);
    const foreign = new Request('http://localhost/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://elsewhere.example' }, body: '{}' });
    assert.equal((await POST(foreign)).status, 403);
    const malformed = new Request('http://localhost/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal((await POST(malformed)).status, 400);
    assert.equal(calls, 0);
  } finally { global.fetch = previous; }
});

test('delivery uses the existing endpoint and only reports success after acknowledgement', async () => {
  const previous = global.fetch;
  let delivery;
  global.fetch = async (url, options) => { delivery = { url, payload: JSON.parse(options.body) }; return new Response('{}', { status: 200 }); };
  try {
    assert.equal((await POST(request(applicant))).status, 200);
    assert.match(delivery.url, /\/api\/form\/submit-form$/);
    assert.equal(delivery.payload.contactInfo.email, applicant.email);
    global.fetch = async () => new Response('{}', { status: 500 });
    assert.equal((await POST(request(applicant))).status, 502);
    global.fetch = async () => { throw new Error('Network failure'); };
    assert.equal((await POST(request(applicant))).status, 502);
  } finally { global.fetch = previous; }
});
