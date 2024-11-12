import { Loader } from "@/components/loader"
import { Message } from "@/components/message"

export default function Loading() {
  return (
    <div className="p-4">
      <Message
        message={{
          id: "",
          display: <Loader />,
          role: "user",
        }}
      />
    </div>
  )
}
