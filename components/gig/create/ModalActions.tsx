import { Button } from "@/components/ui/button";

const ModalActions = ({
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
}) => (
  <div className="flex justify-end gap-2 mt-6 items-center">
    <div
      className="text-black border-neutral-600 p-2 rounded-xl bg-neutral-400 cursor-pointer"
      onClick={onCancel}
    >
      Cancel
    </div>
    <Button className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm}>
      {confirmText}
    </Button>
  </div>
);
export default ModalActions;
