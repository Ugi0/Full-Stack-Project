import { getFilename } from "./getFileName";

const Icons = new Map();
let CourseIconsFolder = require.context('../images', true);
CourseIconsFolder.keys().map(image => Icons.set(getFilename(image), CourseIconsFolder(`${image}`))); 

export { Icons }