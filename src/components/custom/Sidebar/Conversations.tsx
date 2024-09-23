import { Conversation } from '@/types';
import { FC } from 'react';
import { ConversationComponent } from './Conversation';

interface Props {
  loading: boolean;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversation: Conversation) => void;
  onUpdateConversation: (
    conversation: Conversation,
  ) => void;
}

export const Conversations: FC<Props> = ({
  loading,
  conversations,
  selectedConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation,
}) => {
  return (
    <div className="flex w-full flex-col gap-1 pt-2">
      {conversations.slice().reverse().map((conversation, index) => (
        <ConversationComponent
          key={index}
          selectedConversation={selectedConversation}
          conversation={conversation}
          loading={loading}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onUpdateConversation={onUpdateConversation}
        />
      ))}
    </div>
  );
};
