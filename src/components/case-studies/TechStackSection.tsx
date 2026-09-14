import React from "react";
import Image from "next/image";
import { Heading } from "../common/Heading";

const TechStackSection = () => {
  const techLogos = [
    { name: "Node.js", path: "/icons/tech/node.svg" },
    { name: "Angular", path: "/icons/tech/angular.svg" },
    { name: "Vue.js", path: "/icons/tech/vue.svg" },
    { name: "Flutter", path: "/icons/tech/flutter.svg" },
    { name: "Java", path: "/icons/tech/java.svg" },
    { name: "React", path: "/icons/tech/react.svg" },
    { name: "JS", path: "/icons/tech/js.svg" },
    { name: "AWS", path: "/icons/tech/aws.svg" },
  ];

  return (
    <section className=" py-18">
      <div className="container mx-auto px-4 text-center">
        <Heading level={3}>The Key Technologies We Used</Heading>

        {/* Tech Logos Grid */}
        <div className="flex justify-center gap-9 flex-wrap mt-5 sm:w-[550px] mx-auto">
          {techLogos.map((tech, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded-full flex items-center justify-center shadow-sm dark:shadow-none"
            >
              <Image
                src={tech.path}
                alt={`${tech.name} logo`}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
