import ReactGA from "react-ga4";

/**
 * Tracks a custom or GA4 standard event.
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  ReactGA.event({
    action: eventName,
    ...eventParams,
  });
};

/**
 * Tracks a GA4 E-commerce event (e.g., view_item, begin_checkout, purchase).
 */
export const trackEcommerceEvent = (eventName: string, items: any[], params?: Record<string, any>) => {
  ReactGA.event({
    action: eventName,
    ...params,
    items: items.map(item => ({
      item_id: item.id || item._id,
      item_name: item.name || item.title,
      price: item.price,
      quantity: 1,
      ...item
    }))
  });
};
