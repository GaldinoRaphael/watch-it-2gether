import { useState } from 'react';

const NAME_OVERRIDE_KEY = 'user_name_override';

export function useUpdateName() {
  const [name, setNameState] = useState<string | null>(
    () => localStorage.getItem(NAME_OVERRIDE_KEY),
  );

  const updateName = (newName: string) => {
    localStorage.setItem(NAME_OVERRIDE_KEY, newName);
    setNameState(newName);
  };

  return { nameOverride: name, updateName };
}
