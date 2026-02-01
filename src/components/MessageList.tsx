import MessageBubble from './MessageBubble'
import MessageCard from './MessageCard'

export default function MessageList() {
  return (
    <div className="px-4 py-6 space-y-4">
      <MessageBubble role="bot">
        Let’s plan your next adventure! 🌍  
        How about exploring the Amalfi Coast in Italy?
      </MessageBubble>

      <MessageCard title="Amalfi Coast, Italy — Beaches, Culture, Food" />

      <MessageBubble role="user">
        Sounds amazing! What are the must-visit spots?
      </MessageBubble>

      <MessageBubble role="bot">
        Top picks: Positano, Ravello, and Capri.  
        I can create an itinerary — would you like that?
      </MessageBubble>
    </div>
  )
}
