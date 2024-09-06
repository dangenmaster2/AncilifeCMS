import React from 'react'
import Layout from '../../components/layout/Layout'
import HeroSection from '../../components/heroSection/HeroSection'
import BlogPostCard from '../../components/blogPostCard/BlogPostCard'
import Loader from '../../components/loader/Loader'

function Home() {
  return (
    <Layout>
        <HeroSection/>
        <BlogPostCard/>
        <Loader />
    </Layout>
  )
}

export default Home