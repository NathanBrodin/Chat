import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { data } = useSuspenseQuery(convexQuery(api.todos.list, {}));
  const { mutate, isPending } = useMutation({ mutationFn: useConvexMutation(api.todos.add) });

  return (
    <div>
      Hello, world
      <ul>
        {data.map((todo) => (
          <li key={todo._id}>{todo.text}</li>
        ))}
      </ul>
      <button onClick={() => mutate({ text: "Hello" })} disabled={isPending}>
        Create new
      </button>
    </div>
  );
}
