import {SearchClient} from "./components/searchClient"
import { FetchBooks } from "./components/executeQuery"
import { TransitionToHome } from "./components/transitionToHome"


export default function SearchPage(){
    return(
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Search Books</h1>
                <TransitionToHome />
                <SearchClient FetchBooks={FetchBooks}/>
            </div>
        </>
    )
}