export function getFilename(pathfilename){

    var filenameextension = pathfilename.replace(/^.*[\\/]/, '');
    var filename = filenameextension.substring(0, filenameextension.lastIndexOf('.'));
    
    return filename;
  
  }