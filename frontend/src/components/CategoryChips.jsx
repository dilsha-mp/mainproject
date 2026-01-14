const categories = [
  { name: "All", icon: "🎟️" },
  { name: "Movies", icon: "🎬" },
  { name: "Sports", icon: "🏏" },
  { name: "Music", icon: "🎵" },
  { name: "Workshops", icon: "🧠" },
  { name: "Comedy", icon: "😂" },
  { name: "Activities", icon: "🎯" }
];

export default function CategoryChips({ active, setActive }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 mt-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActive(cat.name)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap
              ${
                active === cat.name
                  ? "bg-[#E31B23] text-white border-[#E31B23]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            <span className="text-base">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
