import { ForwardedRef, forwardRef } from "react";
interface ConfirmationDialogBoxProps {
	onConfirm: () => Promise<void>;
	onCancel?: () => void;
	confirmText: string;
	cancelText: string;
	message: string;
	heading: string;
}

const ConfirmationDialogBox = forwardRef(function (
	{
		onConfirm,
		onCancel,
		confirmText,
		cancelText,
		message,
		heading,
	}: ConfirmationDialogBoxProps,
	ref: ForwardedRef<HTMLDialogElement>
) {
	function closeDialog() {
		if (ref && "current" in ref && ref.current) {
			ref.current.close();
		}
	}

	const handleCancel = () => {
		closeDialog();
		if (onCancel) {
			onCancel();
		}
	};

	const handleConfirm = async () => {
		await onConfirm();
		closeDialog();
	};

	return (
		<div className="flex flex-col gap-4 p-4 text-base text-gray-100">
			<div>{heading}</div>
			<div className="text-sm">{message}</div>
			<div className="flex justify-end gap-6">
				<button
					className="rounded-md bg-indigo-700 px-2 py-1 hover:bg-indigo-500"
					onClick={handleCancel}
				>
					{cancelText}
				</button>
				<button
					className="rounded-md bg-pink-600 px-2 py-1 text-left hover:bg-pink-500"
					onClick={handleConfirm}
				>
					{confirmText}
				</button>
			</div>
		</div>
	);
});

ConfirmationDialogBox.displayName = "ConfirmationDialogBox";
export default ConfirmationDialogBox;
