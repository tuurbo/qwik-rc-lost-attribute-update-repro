import { component$, useSignal, useStyles$ } from "@qwik.dev/core";

const Alert = component$<{ message: string }>((props) => <div role="alert">{props.message}</div>);

export default component$(() => {
  useStyles$(".busy { opacity: 0.4 }");
  const busy = useSignal(false);
  const error = useSignal("");

  return (
    <section>
      {!!error.value && <Alert message={error.value} />}
      <button
        aria-busy={busy.value || undefined}
        class={["pay", busy.value && "busy"]}
        onClick$={async () => {
          error.value = "";
          busy.value = true;
          await new Promise((r) => setTimeout(r, 1500));
          error.value = "Card declined";
          busy.value = false;
        }}
      >
        Pay
      </button>
      <p>busy signal: {String(busy.value)}</p>
    </section>
  );
});
