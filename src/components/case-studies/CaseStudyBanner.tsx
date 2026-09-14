import Image from "next/image";

export default function CaseStudyBanner() {
  return (
    <div className="flex flex-col">
      <div className="relative isolate flex flex-col lg:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight dark:text-[#E8E9EA] text-[#272A2D]">
            <span className="bg-gradient-to-r from-[#2563EB] via-[#2FBAF8] to-[#34E5FF] bg-clip-text text-transparent">
              DASGUZO
            </span>
            <br />
            Revolutionizing Peer-To-Peer Car Rentals
          </h2>
          <p className="dark:text-[#E8E9EA] text-lg leading-relaxed text-[#272A2D]">
            DASGUZO aims to create a streamlined Peer-to-Peer (P2P) car rental
            platform, allowing users to rent vehicles from local owners easily.
            The app will also enable users to report car-related issues—such as
            mechanical problems or damage—simply and track their resolution.
          </p>
        </div>

        {/* Decorative glow behind the phone. `isolate` on the row above is
            what scopes the negative z-index to this banner — `relative`
            alone doesn't create a stacking context, so the layer used to
            escape and paint against the page instead. Light mode gets a
            much lower opacity: the same 50% that reads as a glow on a dark
            page reads as a blue smear on a white one. */}
        <div
          aria-hidden
          className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 dark:opacity-50 blur-[85px] z-[-1]"
          style={{
            background: "linear-gradient(to left, #2563EB, #2CA2F4, #34E5FF)",
          }}
        />
        <div className="relative w-full max-w-md flex justify-center ">
          <Image
            src="/images/case-studies/iPhone-15.svg"
            alt="DASGUZO App Mockup"
            width={300}
            height={600}
            className="w-auto h-auto max-h-[600px] drop-shadow-2xl"
            priority
          />
        </div>
      </div>
      {/* Who Was The Client Section */}
      <div className="py-16 items-start text-left">
        <div className="">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 dark:text-[#E8E9EA] text-[#272A2D]">
            Who Was The Client
          </h3>
          <p className="text-[#272A2D] dark:text-[#DBDDDE] text-base sm:text-lg leading-relaxed">
            DASGUZO is an innovative company dedicated to reshaping the car
            rental experience by connecting car owners with renters. The
            platform allows users to rent vehicles from local owners, while
            offering owners an easy way to generate income from unused cars.
            Alongside the rental service, DASGUZO integrates an issue reporting
            system, allowing users to report problems with the car they rented,
            helping maintain a high standard of service and vehicle quality.
          </p>
        </div>
      </div>
    </div>
  );
}
