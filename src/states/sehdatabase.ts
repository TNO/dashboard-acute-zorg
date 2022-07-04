import { ActionCreator } from 'easy-peasy';
import { openDB } from 'idb';
import { ISEHForm } from '../interfaces/sehform';
import { IZiekenhuis } from '../interfaces/ziekenhuis';

const dbPromise = openDB('sehforms-store', 1, {
  upgrade(db) {
    db.createObjectStore('sehforms',
      {
        autoIncrement: true,
      });
  },
})

async function get(key: string) {
  return (await dbPromise).get('sehforms', key) as Promise<ISEHForm>;
}
async function set(key: string, sehForm: ISEHForm) {
  return (await dbPromise).put('sehforms', sehForm, key)
}
async function getAllkeys() {
  return (await dbPromise).getAllKeys('sehforms')
}
export async function del(key: string) {
  return (await dbPromise).delete('sehforms', key);
};

export async function saveSehFormToIndexDatabase(ziekenhuisId: number, sehForm: ISEHForm) {
  set(ziekenhuisId.toString(), sehForm)
}

export async function loadAllSehFormsFromIndexDatabase(loadSEHForm: ActionCreator<{ ziekenhuisId: number; sehForm: ISEHForm; }>) {
  const keys = getAllkeys();

  (await keys).forEach( async key => {
    const sehForm = await get(key.toString())
    const ziekenhuisId = parseInt(key.toString())
    loadSEHForm({ziekenhuisId: ziekenhuisId, sehForm: sehForm})
  })
}

export async function removeAllSehFormsFromIndexDatabase() {
  const keys = getAllkeys();

  (await keys).forEach( async key => {
    del(key as string)
  })
}