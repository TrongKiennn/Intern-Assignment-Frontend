import ContactCard from "./ContactCard";

const mostVisited = [
  { name: "Disney", count:0 },
  { name: "Marie Jones", count: 1 },
  { name: "Mateo Jensen", count: 0 },
  { name: "Sofia Muller", count: 0 },
  { name: "Thomas Clark", count: 0 },
  { name: "Nvidia", count: 0 },
];

const leastVisited = [
  { name: "Victoria Ballard", count: 0 },
  { name: "Nvidia", count: 0 },
  { name: "Thomas Clark", count: 0 },
  { name: "Sofia Muller", count: 0 },
  { name: "Mateo Jensen", count: 0 },
  { name: "Vivian Casey", count: 0 },
];

export default function DashboardContacts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
      <ContactCard title="Most visited contacts" contacts={mostVisited} />
      <ContactCard title="Least visited contacts" contacts={leastVisited} />
    </div>
  );
}
