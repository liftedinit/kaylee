import { Flex, FormControl, FormLabel, Input } from "@liftedinit/ui";

interface FieldProps {
  name: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: any;
  label: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  placeholder?: string;
  value?: any;
}

export default function Field({
  defaultValue,
  label,
  name,
  onChange,
  isRequired,
  isReadOnly,
  value,
  placeholder,
}: FieldProps) {
  return (
    <FormControl mt={3} isReadOnly={isReadOnly} isRequired={isRequired}>
      <Flex>
        <FormLabel w={200} htmlFor={name}>
          {label}
        </FormLabel>
        <Input
          defaultValue={defaultValue}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      </Flex>
    </FormControl>
  );
}
