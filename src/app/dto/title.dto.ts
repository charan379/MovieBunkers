import MovieDTO from "./movie.dto";
import TvDTO from "./Tv.dto";


interface TitleDTO extends MovieDTO, TvDTO, TitleAuthorDTO {


}



export default TitleDTO;