import { useEffect, useState } from 'react';

const ipcRenderer = window.require('electron').ipcRenderer;

const useHardwareId = (callback?: Function) => {
  const [machineId, setMachineId] = useState('');

  useEffect(() => {
    ipcRenderer.send('machine_id');
    ipcRenderer.on('machine_id', async (_: any, arg: any) => {
      ipcRenderer.removeAllListeners('machine_id');
      setMachineId(arg.machineId);
    });

    return () => ipcRenderer.removeAllListeners('machine_id');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    callback && callback(machineId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineId]);

  return machineId;
};

export default useHardwareId;
