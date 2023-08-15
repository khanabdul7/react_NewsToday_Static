import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';

const News = (props) => {

    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const firstLetterCapital = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updatePage = async () => {
        props.setProgress(10);
        setLoading(true)
        await fetch(`../NewsData/${props.category}.json`)
            .then(data => data.json())
            .then(processedData => {
                props.setProgress(30);
                console.log(processedData)
                props.setProgress(50);
                setArticles(processedData.articles)
                setPage(page + 1)
                setLoading(false)
                props.setProgress(100);
            }
            ).catch(err => console.log("error occured: " + err));
    }

    useEffect(() => {
        document.title = `NewsToday - ${firstLetterCapital(props.category)}`
        updatePage()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <h2 className='text-center' style={{ marginTop: '60px', marginDown: '70px' }}>NewsToday - Top {firstLetterCapital(props.category)} Headlines</h2>
            {loading && <Spinner />}
            <div className='container'>
                <div className='row'>
                    {articles.map((element) => {
                        return <div className='col-md-4' key={element.url}>
                            <NewsItem title={element.title} desc={element.description} imageUrl={element.urlToImage} newsUrl={element.url} publishedAt={element.publishedAt} author={element.author} source={element.source.name} />
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default News;

News.defaultProps = {
    pageSize: 12,
    country: 'in',
    category: 'general'
}

News.propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string
}