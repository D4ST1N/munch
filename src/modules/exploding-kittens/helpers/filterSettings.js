export default function filterSettings(settings, fields) {
  if (!fields) {
    return settings;
  }

  const includesSetting = (fields, settingKey) => {
    return fields.some((field) => {
      if (typeof field === 'object') {
        return field.key === settingKey;
      }

      return field === settingKey;
    });
  };

  const getField = (key) => fields.find((field) => {
    if (typeof field === 'object') {
      return field.key === key;
    }

    return field === key;
  });

  const filteredSettings = {};
  const filteredKeys = Object.keys(settings).filter((key) => includesSetting(fields, key));

  filteredKeys.forEach((key) => {
    const field = getField(key);

    if (field.fields) {
      filteredSettings[key] = filterSettings(settings[key], field.fields);
    } else {
      filteredSettings[key] = settings[key];
    }
  });

  return filteredSettings;
}
