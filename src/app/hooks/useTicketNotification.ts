import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getNotifyAbleTickets } from "../stores/ticketSlice";
import dayjs from "dayjs";
import notifySound from "../assets/notify2.mp3";
import useSound from "use-sound";

const useTicketNotification = () => {
  const notifyAbleTickets = useSelector(getNotifyAbleTickets);
  const [notifySoundPlay] = useSound(notifySound, { volume: 100 / 100 });

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    setInterval(
      () => {
        notifyAbleTickets.forEach((ticket) => {
          const diff = dayjs().diff(ticket.deadline, "d");
          if (!ticket?.isNotified && diff === 0) {
            new Notification("👀締め切り当日", { body: ticket.title }).onshow =
              () => {
                notifySoundPlay();
              };
          } else if (!ticket?.isNotified && diff === 1) {
            new Notification("🔴締め切り1日前", { body: ticket.title }).onshow =
              () => {
                notifySoundPlay();
              };
          } else if (!ticket?.isNotified && diff === 2) {
            new Notification("❗️締め切り2日前", { body: ticket.title }).onshow =
              () => {
                notifySoundPlay();
              };
          } else if (!ticket?.isNotified && diff > 2) {
            new Notification("❌大幅な遅れ(2日以上)", {
              body: ticket.title,
            }).onshow = () => {
              notifySoundPlay();
            };
          }
        });
      },
      1000 * 60 * 60,
    );
  }, [notifyAbleTickets]);
};

export default useTicketNotification;
