import { IconCheck, IconTrashX, IconX } from "@tabler/icons-react";
import { FC, useState } from "react";

interface Props {
  onClearConversations: () => void;
}

export const ClearConversations: FC<Props> = ({ onClearConversations }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleClearConversations = () => {
    onClearConversations();
    setIsConfirming(false);
  };

  return isConfirming ? (
    <div className="flex cursor-pointer select-none gap-3 items-center rounded-md transition-colors duration-200">
      <div className="flex w-[40px]">
        <IconCheck
          className="ml-auto min-w-[20px] mr-1"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            handleClearConversations();
          }}
        />

        <IconX
          className="ml-auto min-w-[20px]"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <button
      className="flex cursor-pointer select-none gap-3 items-center rounded-md transition-colors duration-200"
      onClick={() => setIsConfirming(true)}
    >
      <IconTrashX size={18} />
    </button>
  );
};
