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
  <div className="flex justify-end gap-2 mt-6">
    <Button
      variant="outline"
      className="text-black border-neutral-600"
      onClick={onCancel}
    >
      Cancel
    </Button>
    <Button className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm}>
      {confirmText}
    </Button>
  </div>
);
export default ModalActions;
