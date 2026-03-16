const TopNotification = () => {
  return (
    <div className="absolute top-5 right-10 bg-white shadow-lg px-4 py-2 rounded-full flex items-center gap-3">
      <img
        src="https://i.pravatar.cc/40"
        alt="user"
        className="w-8 h-8 rounded-full"
      />
      <p className="text-sm">New Message from John D.</p>
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        3
      </span>
    </div>
  );
};

export default TopNotification;