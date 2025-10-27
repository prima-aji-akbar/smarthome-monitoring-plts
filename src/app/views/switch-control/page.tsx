import SwitchController from "./sections/switch-controller";

export default function SwitchControl() {
  return (
    <div className="w-full">
      <div className="bg-[var(--body-background)] min-h-screen lg:px-8">
        <div className="w-full max-w-[100%] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="w-full flex">
            <SwitchController />
          </div>
        </div>
      </div>
    </div>
  );
}