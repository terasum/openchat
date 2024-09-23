import { Conversation } from "@/types";
import {
  IconCheck,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DragEvent, FC, KeyboardEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  selectedConversation?: Conversation | null;
  conversation: Conversation;
  loading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversation: Conversation) => void;
  onUpdateConversation: (
    conversation: Conversation,
  ) => void;
}

export const ConversationComponent: FC<Props> = ({
  selectedConversation,
  conversation,
  loading,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && selectedConversation) {
      e.preventDefault();
      handleRename(selectedConversation);
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLButtonElement>,
    conversation: Conversation
  ) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData("conversation", JSON.stringify(conversation));
    }
  };

  const handleRename = (conversation: Conversation) => {
    onUpdateConversation(conversation);
    setRenameValue("");
    setIsRenaming(false);
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className="relative flex items-center">
      {isRenaming && selectedConversation?.id === conversation.id ? (
        <div className="flex w-full items-center">
          <input
            className={cn(
              "w-full text-left p-2 pl-4 pr-4 truncate overflow-hidden flex flex-row  justify-between gap-2 rounded-lg border text-sm transition-all hover:bg-accent cursor-default ",
              loading ? "disabled:cursor-not-allowed" : "",
              selectedConversation?.id === conversation.id ? "bg-muted" : "bg-white"
            )}
            
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleEnterDown}
            autoFocus
          />
        </div>
      ) : (
        <button
          className={cn(
            "w-full text-left mt-1 mb-1 p-2 px-3 py-3  pl-4 pr-4 truncate overflow-hidden flex flex-row  justify-between gap-2 rounded-lg border text-sm transition-all hover:bg-accent cursor-default ",
            loading ? "disabled:cursor-not-allowed" : "",
            selectedConversation?.id === conversation.id ? "bg-muted" : "bg-white"
          )}
          onClick={() => onSelectConversation(conversation)}
          disabled={loading}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, conversation)}
        >
          <div
            className={`relative max-h-5 flex-1 text-[14px] leading-3 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left ${
              selectedConversation?.id === conversation.id ? "pr-12" : "pr-1"
            }`}
          >
            {conversation.title}
          </div>
        </button>
      )}

      {(isDeleting || isRenaming) &&
        selectedConversation?.id === conversation.id && (
          <div className="visible absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                if (isDeleting) {
                  onDeleteConversation(conversation);
                } else if (isRenaming) {
                  handleRename(conversation);
                }
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconCheck size={18} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconX size={18} />
            </button>
          </div>
        )}

      {/* deleteing and remaining button */}
      {selectedConversation?.id === conversation.id &&
        !isDeleting &&
        !isRenaming && (
          <div className="visible absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setRenameValue(selectedConversation?.title);
              }}
            >
              <IconPencil size={18} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
            >
              <IconTrash size={18} />
            </button>
          </div>
        )}
    </div>
  );
};
