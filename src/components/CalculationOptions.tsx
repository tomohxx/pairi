import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Switch } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import type { WindType } from "../lib/types";

const winds: { label: string; value: WindType }[] = [
  { label: "東", value: "east" },
  { label: "南", value: "south" },
  { label: "西", value: "west" },
  { label: "北", value: "north" },
];

const turns = Array.from({ length: 19 }, (_, value) => value);
const nukidoraCounts = Array.from({ length: 5 }, (_, value) => value);

type CalculationOptionsProps = {
  useRed: boolean;
  threePlayer: boolean;
  fourTileSevenPairs: boolean;
  useExtra: boolean;
  riichi: boolean;
  seatWind: WindType;
  roundWind: WindType;
  tMax: number;
  numNukidora: number;
  onRedDoraChange: (enabled: boolean) => void;
  onThreePlayerChange: (enabled: boolean) => void;
  onFourTileSevenPairsChange: (enabled: boolean) => void;
  onUseExtraChange: (enabled: boolean) => void;
  onRiichiChange: (enabled: boolean) => void;
  onSeatWindChange: (windType: WindType) => void;
  onRoundWindChange: (windType: WindType) => void;
  onTMaxChange: (tMax: number) => void;
  onNumNukidoraChange: (count: number) => void;
};

export function CalculationOptions({
  useRed,
  threePlayer,
  fourTileSevenPairs,
  useExtra,
  riichi,
  seatWind,
  roundWind,
  tMax,
  numNukidora,
  onRedDoraChange,
  onThreePlayerChange,
  onFourTileSevenPairsChange,
  onUseExtraChange,
  onRiichiChange,
  onSeatWindChange,
  onRoundWindChange,
  onTMaxChange,
  onNumNukidoraChange,
}: CalculationOptionsProps) {
  return (
    <div className="flex min-w-0 flex-col text-zinc-100">
      <div className="shrink-0 pb-3">
        <h2 className="font-display font-semibold text-zinc-50">設定</h2>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <ToggleButton label="赤ドラ" enabled={useRed} onChange={onRedDoraChange} />
        <ToggleButton label="三人麻雀" enabled={threePlayer} onChange={onThreePlayerChange} />
        <ToggleButton label="四枚使い七対子" enabled={fourTileSevenPairs} onChange={onFourTileSevenPairsChange} />
        <ToggleButton label="向聴戻し・手変わり" enabled={useExtra} onChange={onUseExtraChange} />
        <ToggleButton label="立直" enabled={riichi} onChange={onRiichiChange} />
      </div>
      <WindButtonGroup label="自風" value={seatWind} onChange={onSeatWindChange} />
      <WindButtonGroup label="場風" value={roundWind} onChange={onRoundWindChange} />
      <TurnListbox value={tMax} onChange={onTMaxChange} />
      {threePlayer ? <NukidoraListbox value={numNukidora} onChange={onNumNukidoraChange} /> : null}
    </div>
  );
}

type ToggleButtonProps = {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function ToggleButton({ label, enabled, onChange }: ToggleButtonProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 px-1 py-1 text-sm font-semibold text-zinc-300 sm:px-3">
      <span>{label}</span>
      <Switch
        checked={enabled}
        onChange={onChange}
        className="group relative h-5 w-9 shrink-0 rounded-full bg-zinc-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none data-checked:bg-teal-500"
      >
        <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-zinc-100 transition-transform group-data-checked:translate-x-4" />
      </Switch>
    </div>
  );
}

type WindButtonGroupProps = {
  label: string;
  value: WindType;
  onChange: (windType: WindType) => void;
};

function WindButtonGroup({ label, value, onChange }: WindButtonGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-1 px-1 py-1 sm:px-3">
      <span>{label}</span>
      <div className="grid w-full grid-cols-4 overflow-hidden rounded border border-zinc-700">
        {winds.map((wind) => (
          <label
            key={wind.value}
            className="relative flex h-6 cursor-pointer items-center justify-center border-r border-zinc-700 text-sm font-semibold text-zinc-300 last:border-r-0 has-checked:bg-teal-500 has-checked:text-zinc-950 has-focus-visible:z-10 has-focus-visible:ring-2 has-focus-visible:ring-teal-400"
          >
            <input
              type="radio"
              name={label}
              value={wind.value}
              checked={value === wind.value}
              onChange={() => onChange(wind.value)}
              className="sr-only"
            />
            {wind.label}
          </label>
        ))}
      </div>
    </div>
  );
}

type TurnListboxProps = {
  value: number;
  onChange: (value: number) => void;
};

function TurnListbox({ value, onChange }: TurnListboxProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-1 px-1 py-1 sm:px-3">
      <span>最終巡目</span>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative flex h-7 w-full items-center justify-center rounded border border-zinc-700 bg-zinc-900 px-2 text-sm font-semibold text-zinc-300 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none">
            <span>{value}巡目</span>
            <HiChevronUpDown aria-hidden="true" className="absolute right-2 size-4 text-zinc-400" />
          </ListboxButton>
          <ListboxOptions className="absolute right-0 z-20 mt-1 max-h-52 w-full overflow-y-auto rounded border border-zinc-700 bg-zinc-900 py-1 shadow-xl focus:outline-none">
            {turns.map((turn) => (
              <ListboxOption
                key={turn}
                value={turn}
                className="cursor-pointer px-2 py-1 text-center text-sm font-semibold text-zinc-300 focus:bg-teal-500 focus:text-zinc-950 data-selected:bg-teal-500 data-selected:text-zinc-950"
              >
                {turn}巡目
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}

type NukidoraListboxProps = {
  value: number;
  onChange: (value: number) => void;
};

function NukidoraListbox({ value, onChange }: NukidoraListboxProps) {
  return (
    <div className="grid grid-cols-2 items-center gap-1 px-1 py-1 sm:px-3">
      <span>抜きドラ</span>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative flex h-7 w-full items-center justify-center rounded border border-zinc-700 bg-zinc-900 px-2 text-sm font-semibold text-zinc-300 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none">
            <span>{value}</span>
            <HiChevronUpDown aria-hidden="true" className="absolute right-2 size-4 text-zinc-400" />
          </ListboxButton>
          <ListboxOptions className="absolute right-0 z-20 mt-1 max-h-52 w-full overflow-y-auto rounded border border-zinc-700 bg-zinc-900 py-1 shadow-xl focus:outline-none">
            {nukidoraCounts.map((count) => (
              <ListboxOption
                key={count}
                value={count}
                className="cursor-pointer px-2 py-1 text-center text-sm font-semibold text-zinc-300 focus:bg-teal-500 focus:text-zinc-950 data-selected:bg-teal-500 data-selected:text-zinc-950"
              >
                {count}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
