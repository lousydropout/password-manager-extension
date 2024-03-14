import { useEffect } from "react";
import { useChromeStorageLocal } from "./useChromeLocalStorage";
import { useCurrentTab } from "./useCurrentTab";

const URL = "http://localhost:3000";

type MessageType = "FROM_EXTENSION";

type Context<State> = {
  state: State;
  action: string;
  context: Record<string, any>;
  send: boolean;
};

function useFiniteState<State>(
  defaultState: State,
  calculateNextState: (state: State, action: string) => State
): [
  State,
  (
    action?: string | null,
    _context?: Record<string, any>,
    send?: boolean
  ) => void
] {
  const [url, setUrl] = useChromeStorageLocal<string>("URL", URL);
  const [currentTab, currentUrl] = useCurrentTab();
  const [action, setAction] = useChromeStorageLocal<string>("action", "");
  const [context, setContext] = useChromeStorageLocal<Context<State>>(
    "context",
    { state: defaultState, action: "", context: {}, send: false }
  );

  const updateContext = (
    action: string | null = null,
    _context: Record<string, any> = {},
    send: boolean = false
  ) => {
    setContext((prev) => ({
      ...prev,
      context: { ...prev.context, ..._context },
      action: action ? action : "",
      send,
    }));
  };

  useEffect(() => {
    const sendMessage = async () => {
      setContext((prev) => {
        postMessage(prev.action, prev.context);
        return { ...prev, send: false };
      });
    };

    console.log("context: ", context);

    if (context.send && context.action) sendMessage();
  }, [context]);

  const postMessage = async (action: string, _context: Record<string, any>) => {
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
      console.log("sending to tab.id ", tab.id);
      if (typeof tab.id !== "number") return;

      await chrome.tabs.sendMessage(tab.id as number, {
        type: "FROM_EXTENSION",
        channelName: "state",
        action,
        context: _context,
      });
    });
  };

  useEffect(() => {
    if (action === undefined) return;
    setContext((currentContext) => ({
      ...currentContext,
      state: calculateNextState(currentContext.state, action),
    }));
  }, [action]);

  return [context.state, updateContext];
}

export { useFiniteState };
