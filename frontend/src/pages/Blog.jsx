import React from 'react';
import Header from '../components/Header';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import ComingSoonModal from '../components/ComingSoonModal';
import { useState } from 'react';
import '../styles/Blog.css';

const Blog = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const posts = [
        {
            title: 'The Future of Digital Healthcare in India',
            excerpt: 'How technology is bridging the gap between patients and hospitals in rural and urban areas.',
            author: 'Dr. Sarah Johnson',
            date: 'Jan 15, 2025',
            category: 'Industry Trends',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Understanding ER Wait Times',
            excerpt: 'Why ER wait times fluctuate and how MedQueue helps you find the fastest care.',
            author: 'MedQueue Team',
            date: 'Jan 10, 2025',
            category: 'Patient Guide',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'New Feature: Real-time Bed Tracking',
            excerpt: 'We have updated our dashboard to provide even more accurate bed availability data.',
            author: 'Product Team',
            date: 'Jan 05, 2025',
            category: 'Product Update',
            image: 'https://images.unsplash.com/photo-1516549655169-df83a092fc43?auto=format&fit=crop&w=800&q=80'
        }
    ];

    return (
        <div className="blog-page">
            <Header />

            <div className="blog-hero">
                <h1>MedQueue Blog</h1>
                <p>Insights, updates, and stories from the world of healthcare.</p>
            </div>

            <div className="blog-grid">
                {posts.map((post, index) => (
                    <motion.article
                        key={index}
                        className="blog-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="blog-image" style={{ backgroundImage: `url(${post.image})` }}>
                            <span className="category-tag">{post.category}</span>
                        </div>
                        <div className="blog-content">
                            <div className="blog-meta">
                                <span><Calendar size={14} /> {post.date}</span>
                                <span><User size={14} /> {post.author}</span>
                            </div>
                            <h2>{post.title}</h2>
                            <p>{post.excerpt}</p>
                            <button className="read-more" onClick={() => setIsModalOpen(true)}>
                                Read Article <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.article>
                ))}
            </div>

            <ComingSoonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Article Coming Soon"
            />

        </div>
    );
};

export default Blog;
