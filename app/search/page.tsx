import {SearchClient} from "./components/searchClient"
import { FetchBooks } from "./components/executeQuery"
import { TransitionHome } from "./components/transitionHome"


export default function SearchPage(){
    return(
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Search Books</h1>
                <TransitionHome />
                <SearchClient FetchBooks={FetchBooks}/>
            </div>
        </>
    )
}