import { useCallback, useEffect, useState } from 'react';
import { fresh } from '../util';

type FormOptions = {
  validators?: any;
  defaultValues: any;
};

const useForm = ({ defaultValues, validators }: FormOptions) => {
  const [formData, setFormData] = useState(defaultValues);
  const [validationData, setValidationData] = useState<any>({});

  const resetForm = useCallback(() => {
    setFormData(defaultValues);
  }, [defaultValues]);

  const updateAll = useCallback((newData: any) => {
    setFormData(fresh(newData));
  }, []);

  const getNewState = useCallback((old: any, field: string, value: any) => {
    const [firstField, secondField] = field.split('.');
    if (secondField && firstField) {
      return { ...old, [firstField]: { ...(old[firstField] || {}), [secondField]: value } };
    }

    return { ...old, [firstField]: value };
  }, []);

  const updateForm = useCallback(
    (field: string, value: any) => {
      setFormData((old: any) => getNewState(old, field, value));

      if (validators && validators[field] && typeof validators[field] === 'function') {
        const valid = validators[field](value);
        setValidationData((old: any) => getNewState(old, field, valid));
      }
    },
    [getNewState, validators]
  );

  const update = useCallback(
    (field: string) => {
      return (value: any) => updateForm(field, value);
    },
    [updateForm]
  );

  useEffect(() => {
    setFormData({ ...formData, ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return { data: formData, error: validationData, resetForm, update, updateAll };
};

export default useForm;
