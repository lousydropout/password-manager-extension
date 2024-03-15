import { useEffect } from "react";
import { useChromeStorageLocal } from "./useChromeLocalStorage";
import { useCurrentTab } from "./useCurrentTab";

const URL = "http://localhost:3000";

type MessageType = "FROM_EXTENSION";

export type Context<State> = {
  state: State;
  action: string;
  context: Record<string, any>;
  send: boolean;
};

export type Message = {
  type: "FROM_EXTENSION";
  action: string;
  data: Record<string, any>;
};

function useFiniteStateMachine<State>(
  defaultState: State,
  calculateNextState: (
    context: Context<State>,
    message: Message
  ) => Context<State>
): [
  State,
  Record<string, any>,
  (
    action?: string | null,
    _context?: Record<string, any>,
    send?: boolean
  ) => void
] {
  // Note: there are 2 actions:
  //   - `action` -- this is the action received by the state machine and that'll be used to modify the state
  //   - `context.action` -- this is the action to be sent as part of `postMessage`.

  const [url] = useChromeStorageLocal<string>("URL", URL);
  const [currentTab] = useCurrentTab();
  const [message] = useChromeStorageLocal<Message>("action", {
    type: "FROM_EXTENSION",
    action: "",
    data: {},
  });
  const [context, setContext] = useChromeStorageLocal<Context<State>>(
    "context",
    { state: defaultState, action: "", context: {}, send: false }
  );

  const updateContext = (
    action: string | null = null,
    data: Record<string, any> = {},
    send: boolean = false
  ) => {
    setContext((prev) => ({
      ...prev,
      context: { ...prev.context, ...data },
      action: action ? action : "",
      send,
    }));
  };

  const postMessage = async (action: string, data: Record<string, any>) => {
    // get all Keyvault tab's IDs
    const tabs = await chrome.tabs.query({ title: "KeyVault" });
    const tabIds = tabs.map((tab) => tab.id);

    // if no tab has title of `KeyVault`, open one
    if (tabs.length === 0 || !tabIds.includes(currentTab?.id)) {
      const newTab = await chrome.tabs.create({ url });
      tabs.push(newTab);
    }

    // send to all KeyVault tabs (nothing sensitive is ever sent)
    tabs.forEach(async (tab) => {
      console.debug("sending to tab.id ", tab.id);
      if (typeof tab.id !== "number") return;

      await chrome.tabs.sendMessage(tab.id as number, {
        type: "FROM_EXTENSION",
        channelName: "action",
        action,
        data,
      });
    });
  };

  useEffect(() => {
    if (!message) return;
    setContext((currentContext) => {
      const nextContext = calculateNextState(currentContext, message);
      console.log("nextContext: ", nextContext);
      return nextContext;
    });
  }, [message]);

  useEffect(() => {
    console.log("context: ", context);
    const sendMessage = async () => {
      setContext((prev) => {
        postMessage(prev.action, prev.context);
        return { ...prev, send: false };
      });
    };

    if (context.send && context.action) sendMessage();
  }, [context]);

  return [context.state, context.context, updateContext];
}

export { useFiniteStateMachine };
