import Image from "next/image";

const requirements = [
  {
    icon: "/images/success-requirement/user-friendly.svg",
    title: "User-Friendly Interface",
    description:
      "Both the car rental and issue reporting features had to be intuitive and easy to navigate, ensuring a smooth user experience for renters and car owners alike.",
  },
  {
    icon: "/images/success-requirement/payment-integration.svg",
    title: "Payment Integration",
    description:
      "A secure payment system that allowed easy booking and payment processing.",
  },
  {
    icon: "/images/success-requirement/chat-functionality.svg",
    title: "Chat Functionality",
    description:
      "Real-time communication between renters, owners, and admins to ensure quick problem resolution and seamless coordination.",
  },
  {
    icon: "/images/success-requirement/admin-dashboard.svg",
    title: "Admin Dashboard",
    description:
      "A user-friendly admin interface for managing listings, bookings, and issue reports effectively.",
  },
];

export default function RequirementForSuccess() {
  return (
    <div className="max-w-7xl sm:px-10 px-4 mx-auto py-12">
      <h2 className="text-3xl text-[#272A2D] dark:text-[#E8E9EA] font-semibold mb-4">
        Requirements For Success
      </h2>
      <p className="text-[#272A2D] dark:text-[#DBDDDE] mb-12">
        To meet DASGUZO’s vision, several key requirements had to be addressed:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
        {requirements.map((item, index) => (
          <div
            key={index}
            className="bg-[#F8F8F8] border border-gray-200 dark:border-transparent dark:bg-gradient-to-r dark:from-[#232323] dark:to-[#292929] p-6 rounded-lg flex gap-4 items-start"
          >
            <div className="flex-shrink-0">
              <Image src={item.icon} alt={item.title} width={40} height={40} />
            </div>
            <div>
              <h3 className="text-lg text-[#272A2D] dark:text-[#FFFFFF] font-semibold mb-1">
                {item.title}
              </h3>
              <p className="dark:text-[#A5A5A5] text-[#272A2D] text-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
