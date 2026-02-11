import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

const voices = [
  "Jennifer (English (US)/American)",
  "Dexter (English (US)/American)",
  "Ava (English (AU)/Australian)",
  "Tilly (English (AU)/Australian)",
  "Charlotte (Advertising) (English (CA)/Canadian)",
  "Charlotte (Meditation) (English (CA)/Canadian)",
  "Cecil (English (GB)/British)",
  "Sterling (English (GB)/British)",
  "Cillian (English (IE)/Irish)",
  "Madison (English (IE)/Irish)",
  "Ada (English (ZA)/South african)",
  "Furio (English (IT)/Italian)",
  "Alessandro (English (IT)/Italian)",
  "Carmen (English (MX)/Mexican)",
  "Sumita (English (IN)/Indian)",
  "Navya (English (IN)/Indian)",
  "Baptiste (English (FR)/French)",
  "Lumi (English (FI)/Finnish)",
  "Ronel Conversational (Afrikaans/South african)",
  "Ronel Narrative (Afrikaans/South african)",
  "Abdo Conversational (Arabic/Arabic)",
  "Abdo Narrative (Arabic/Arabic)",
  "Mousmi Conversational (Bengali/Bengali)",
  "Mousmi Narrative (Bengali/Bengali)",
  "Caroline Conversational (Portuguese (BR)/Brazilian)",
  "Caroline Narrative (Portuguese (BR)/Brazilian)",
  "Ange Conversational (French/French)",
  "Ange Narrative (French/French)",
  "Anke Conversational (German/German)",
  "Anke Narrative (German/German)",
  "Bora Conversational (Greek/Greek)",
  "Bora Narrative (Greek/Greek)",
  "Anuj Conversational (Hindi/Indian)",
  "Anuj Narrative (Hindi/Indian)",
  "Alessandro Conversational (Italian/Italian)",
  "Alessandro Narrative (Italian/Italian)",
  "Kiriko Conversational (Japanese/Japanese)",
  "Kiriko Narrative (Japanese/Japanese)",
  "Dohee Conversational (Korean/Korean)",
  "Dohee Narrative (Korean/Korean)",
  "Ignatius Conversational (Malay/Malay)",
  "Ignatius Narrative (Malay/Malay)",
  "Adam Conversational (Polish/Polish)",
  "Adam Narrative (Polish/Polish)",
  "Andrei Conversational (Russian/Russian)",
  "Andrei Narrative (Russian/Russian)",
  "Aleksa Conversational (Serbian/Serbian)",
  "Aleksa Narrative (Serbian/Serbian)",
  "Carmen Conversational (Spanish/Spanish)",
  "Patricia Conversational (Spanish/Spanish)",
  "Aiken Conversational (Tagalog/Filipino)",
  "Aiken Narrative (Tagalog/Filipino)",
  "Katbundit Conversational (Thai/Thai)",
  "Katbundit Narrative (Thai/Thai)",
  "Ali Conversational (Turkish/Turkish)",
  "Ali Narrative (Turkish/Turkish)",
  "Sahil Conversational (Urdu/Pakistani)",
  "Sahil Narrative (Urdu/Pakistani)",
  "Mary Conversational (Hebrew/Israeli)",
  "Mary Narrative (Hebrew/Israeli)",
];

type VoiceSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
} & ButtonProps;

export function VoiceSelector({
  value,
  onValueChange,
  className,
  ...props
}: VoiceSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          {...props}
          className={cn("max-w-fit justify-between", className)}
          aria-expanded={open}
        >
          {value ? voices.find((voice) => voice === value) : "Select voice..."}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <Command>
          <CommandInput placeholder="Search voices..." className="h-9" />
          <CommandList className="overflow-y-scroll">
            <CommandEmpty>No voice found</CommandEmpty>
            <CommandGroup>
              {voices.map((voice) => (
                <CommandItem
                  key={voice}
                  value={voice}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {voice}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === voice ? "visible" : "invisible",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
