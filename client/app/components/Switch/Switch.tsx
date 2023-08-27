interface SwitchProps {
	checked: boolean;
	updateSettings: () => void;
}

export default function Switch({ checked, updateSettings }: SwitchProps) {
	function updateSetting() {
		updateSettings();
	}

	return (
		<>
			<input
				className="mr-2 h-3.5 w-8 rounded-lg appearance-none bg-neutral-400 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100  after:transition-[background-color_0.2s,transform_0.2s] checked:bg-green-500 checked:after:absolute  checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:transition-[background-color_0.2s,transform_0.2s] hover:cursor-pointer"
				type="checkbox"
				checked={checked}
				id="flexSwitchCheckDefault"
				onClick={updateSetting}
			/>
		</>
	);
}
