import Button from "@mui/material/Button";
import { saveSehFormToIndexDatabase } from "../states/sehdatabase";
import { useStoreActions } from "../states/store";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { InformationIcon } from "./InformationIcon";
import { UPLOAD_INFO } from "../texts";


export const FileUploadButton = () => {

  const loadSEHForm = useStoreActions(actions => actions.loadSEHForm)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
  
    Array.from(e.target.files).forEach(file => {
      const isJson = file.type === "application/json"
  
      if(!isJson) {
        return
      }
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = e => {
        
        const fileAsText = e.target?.result
        if( typeof fileAsText !== "string" ) {
          return 
        }
        const sehFormFile = JSON.parse(fileAsText)
        const sehForm = sehFormFile['form']
        const id = sehFormFile['id']
  
        loadSEHForm({ziekenhuisId: id, sehForm: sehForm})
        saveSehFormToIndexDatabase(id, sehForm)
      };
    })
  }

  return (
    <Button
      variant="contained"
      component="label"
    >
       <div className="flex flex-row gap-2">
        <div>Upload SEH Data Bestand(en) </div>
       <FileUploadOutlinedIcon />  <InformationIcon informationText={UPLOAD_INFO} />
        </div> 
      <input
        type="file"
        hidden
        multiple
        onChange={(e) => {
          handleFileUpload(e)
          // @ts-ignore
          e.target.value = null  // reset file input
        }}
      />
    </Button>
  )
}