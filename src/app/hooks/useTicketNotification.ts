import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getNotifyAbleTickets } from "../stores/ticketSlice";
import dayjs from "dayjs";

const useTicketNotification = () => {
  const notifyAbleTickets = useSelector(getNotifyAbleTickets);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    setInterval(
      () => {
        console.log("notifyAbleTickets", notifyAbleTickets);
        notifyAbleTickets.forEach((ticket) => {
          const diff = dayjs().diff(ticket.deadline, "d");
          if (!ticket?.isNotified && diff === 0) {
            new Notification("👀締め切り当日", { body: ticket.title });
          } else if (!ticket?.isNotified && diff === 1) {
            new Notification("🔴締め切り1日前", { body: ticket.title });
          } else if (!ticket?.isNotified && diff === 2) {
            new Notification("❗️締め切り2日前", { body: ticket.title });
          } else if (!ticket?.isNotified && diff > 2) {
            new Notification("❌大幅な遅れ(2日以上)", { body: ticket.title });
          }
        });
      },
      1000 * 60 * 60,
    );
  }, [notifyAbleTickets]);
};

export default useTicketNotification;
