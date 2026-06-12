import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты Дома на Южной в Борисове: телефоны владельцев, официальный Инстаграм и форма запроса свободных дат."
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
