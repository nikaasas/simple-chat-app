export default function ChatHeader({ userName, photoName }) {
  return (
    <div class="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <div class="font-semibold text-2xl">GoingChat</div>
      <div class="w-1/2">
        <input
          type="text"
          name=""
          id=""
          placeholder="search IRL"
          class="rounded-2xl bg-gray-100 py-3 px-5 w-full"
        />
      </div>
      <div className="flex items-center space-x-3 font-semibold justify-between">
        <p className="text-sm">{userName}</p>
        <div class="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white flex items-center justify-center">
          {photoName}
        </div>
      </div>
    </div>
  );
}
