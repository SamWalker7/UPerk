import Image from "next/image";
import { Heading } from "../common/Heading";
import { Paragraph } from "../common/Paragraph";
interface CardProps {
  imgUrl: string;
  buttonText: string;
  description: string;
  title: string;
}

const AIInsightCard: React.FC<CardProps> = ({
  imgUrl,
  buttonText,
  description,
  title,
}) => {
  return (
    <div className="max-w-[273px] flex-shrink-0 text-white rounded-lg shadow-lg flex flex-col">
      <Image
        src={imgUrl}
        alt="Card Image"
        className="w-full h-48 object-cover"
        width={400}
        height={200}
      />
      <div className="p-4 text-center flex flex-col flex-grow justify-between">
        <div>
          <button className="w-[95px] inline-block bg-[#2664EC1A] dark:bg-black text-xs text-[#2563EB] font-semibold px-2 py-1 rounded-[10.5px] mb-2">
            {buttonText}
          </button>
          <Heading
            level={4}
            className="text-left text-[#2A2A33] dark:text-[white] mb-2"
          >
            {title}
          </Heading>
          <Paragraph className="text-left text-[13.5px] text-[#2A2A33] dark:text-[#A5A5A5] mb-4">
            {description}
          </Paragraph>
        </div>
        <div className="text-left ">
          <button className="text-blue-400 cursor-pointer font-semibold hover:underline">
            Read Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
