import { useCallback, useEffect, useMemo, useState } from 'react';

import { AutoComplete, Checkbox, Input, Select, Textarea } from '../components';
import { apiCall } from '../util';
import useFetch from './useFetch';
import useForm from './useForm';

type ConfigType = {
  id?: string;
  index: number;
  input?: boolean;
  field_key: string;
  data_options?: any;
  label?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  type?: string;
  value_type?: any;
};

type DynamicFormOptions = {
  containerRef?: React.RefObject<any>;
  configFieldsUrl: string;
  configFields: any;
  mixedValues?: any;
};

const useDynamicForm = (
  { configFields, containerRef, configFieldsUrl, mixedValues = {} }: DynamicFormOptions,
  deps?: any
) => {
  const [components, setComponents] = useState<any>([]);
  const [localConfigFields, setLocalConfigFields] = useState<any>(null);
  const [apiData, setApiData] = useState<any>({});
  const [formTick, setFormTick] = useState(0);

  const updateTick = useCallback(() => setFormTick((d: number) => d + 1), []);
  const isDirty = useMemo(() => formTick !== 0, [formTick]);
  const configFieldsDep = useMemo(() => JSON.stringify(configFields), [configFields]);
  const mixedValuesDep = useMemo(() => JSON.stringify(mixedValues), [mixedValues]);

  const getInitValue = useCallback((type: string) => {
    switch (type) {
      case 'bool':
        return false;
      default:
        return '';
    }
  }, []);

  const defaultValues = useMemo(
    () => {
      const defaultObj: any = {};
      const configKeys = Object.keys(configFields);

      const configKeysLength = configKeys.length;

      for (let i = 0; i < configKeysLength; i++) {
        const key = configKeys[i];
        defaultObj[configFields[key]['field_key']] = getInitValue(configFields[key].value_type);
      }

      return defaultObj;
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configFieldsDep]
  );

  const valueRoutes = useMemo(
    () =>
      Object.keys(configFields || {}).reduce((prev, curr) => {
        const { field_key, data_options } = configFields[curr];
        if (data_options && data_options.values) {
          return { ...prev, [field_key]: data_options.values };
        } else {
          return { ...prev };
        }
      }, {}),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configFieldsDep]
  );

  const { update, data, updateAll, resetForm } = useForm({ defaultValues });

  const customUpdateAll = useCallback(
    (v) => {
      updateTick();
      updateAll(v);
    },
    [updateAll, updateTick]
  );

  const { response } = useFetch(configFieldsUrl, [formTick], {
    type: 'POST',
    fresh: true,
    body: data,
  });

  const localConfigFieldsDep = useMemo(
    () => JSON.stringify(localConfigFields),
    [localConfigFields]
  );

  const fields = useMemo(
    () => (isDirty ? localConfigFields || configFields || {} : configFields || {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDirty, localConfigFieldsDep, configFieldsDep]
  );

  const inputFields = useMemo(
    () =>
      Object.keys(fields)
        .map((key: any) => ({
          ...fields[key],
          id: key,
        }))
        .filter((value: ConfigType) => value.input)
        .sort((a, b) => (a.index < b.index ? -1 : 1)),
    [fields]
  );

  const getComponent = (config: ConfigType) => {
    const {
      field_key,
      type = '',
      value_type,
      placeholder,
      label: labelText,
      data_options = {},
    } = config || {};

    const tickChange = (v: any) => {
      updateTick();
      update(field_key)(v);
    };

    const label = (mixedValues || {})[field_key]
      ? `${labelText} <span class="text-gray-5">(Multiple Values)</span>`
      : labelText;

    if (type === 'autocomplete' || type === 'combobox' || type === 'multisuggest') {
      const { id, text } = data_options;
      const combobox = type === 'combobox';
      const multiple = type === 'multisuggest';

      return {
        Component: AutoComplete,
        props: {
          label,
          combobox,
          placeholder,
          itemKey: id,
          itemText: text,
          clearable: true,
          type: value_type,
          multiSelect: multiple,
          value: data[field_key],
          container: containerRef,
          onChange: tickChange,
          items: apiData[field_key] || [],
        },
        config: { ...config },
      };
    } else if (type === 'text') {
      return {
        Component: Input,
        config: { ...config },
        props: {
          label,
          placeholder,
          type: value_type,
          value: data[field_key],
          onInput: update(field_key),
        },
      };
    } else if (type === 'checkbox') {
      return {
        Component: Checkbox,
        config: { ...config },
        props: { label, placeholder, value: data[field_key], onToggle: tickChange },
      };
    } else if (type === 'select') {
      const { id, text } = data_options;

      return {
        Component: Select,
        config: { ...config },
        props: {
          label,
          clearable: true,
          value: data[field_key],
          selectLabel: placeholder,
          onSelectChange: tickChange,
          options: (apiData[field_key] || []).map((o: any) => ({ value: o[id], name: o[text] })),
        },
      };
    } else if (type === 'credentials') {
      return {
        Component: Textarea,
        config: { ...config },
        props: {
          label,
          placeholder,
          heightClass: 'h-40',
          clearable: true,
          type: value_type,
          value: data[field_key],
          onInput: update(field_key),
        },
      };
    }

    return { Component: () => null, props: {} };
  };

  // effects
  useEffect(() => {
    (async () => {
      const newValue: any = {};
      const valueRouteKeys = Object.keys(valueRoutes);
      const valueRouteKeysLength = valueRouteKeys.length;
      for (let i = 0; i < valueRouteKeysLength; i++) {
        let values = [];
        const key = valueRouteKeys[i];
        try {
          const response = await apiCall('GET', (valueRoutes as any)[key]);
          values = response.data || [];
          newValue[key] = values;
        } catch (error) {
          newValue[key] = values;
        }
      }
      setApiData((s: any) => ({ ...s, ...newValue }));
    })();
  }, [valueRoutes, deps]);

  useEffect(() => {
    if (inputFields.length) {
      const newComponents: any = [];

      const filedLength = inputFields.length;
      for (let i = 0; i < filedLength; i++) {
        newComponents.push(getComponent(inputFields[i]));
      }

      setComponents(newComponents);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFields, mixedValuesDep, data, apiData]);

  useEffect(() => {
    setTimeout(() => setLocalConfigFields(response.data || null), 0);
  }, [response]);

  useEffect(() => setFormTick(0), [deps]);

  const reset = useCallback(() => {
    resetForm();
    setFormTick(0);
    setLocalConfigFields(null);
  }, [resetForm]);

  return {
    apiData,
    components,
    inputFields,
    resetForm: reset,
    updateAll: customUpdateAll,
    data: { ...defaultValues, ...data },
  };
};

export default useDynamicForm;
