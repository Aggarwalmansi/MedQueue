import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Mic } from 'lucide-react';
import SearchSuggestions from './SearchSuggestions';
import '../../styles/Search.css';

const SearchBar = ({ isMobile = false, onCloseMobile }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const wrapperRef = useRef(null);

    // Load recent searches
    useEffect(() => {
        const saved = localStorage.getItem('medqueue_recent_searches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchSuggestions(query);

                // Automatic search if on patient dashboard
                if (location.pathname === '/patient') {
                    navigate(`/patient?q=${encodeURIComponent(query)}`, { replace: true });
                }
            } else {
                setSuggestions(null);
                // Clear search if query is empty on dashboard
                if (query.length === 0 && location.pathname === '/patient') {
                    navigate('/patient', { replace: true });
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, location.pathname]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (term) => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const res = await fetch(`${apiUrl}/api/search/suggestions?q=${term}`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        if (!term.trim()) return;

        // Save to recent
        const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('medqueue_recent_searches', JSON.stringify(newRecent));

        setIsFocused(false);
        if (onCloseMobile) onCloseMobile();

        navigate(`/patient?q=${encodeURIComponent(term)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        }
    };

    const removeRecent = (term) => {
        const newRecent = recentSearches.filter(s => s !== term);
        setRecentSearches(newRecent);
        localStorage.setItem('medqueue_recent_searches', JSON.stringify(newRecent));
    };

    const [isListening, setIsListening] = useState(false);

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Voice search is not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className={`search-container ${isFocused ? 'focused' : ''}`} ref={wrapperRef}>
            <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder={isListening ? "Listening..." : "Search hospitals, specializations, beds..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    autoFocus={isMobile}
                />
                {query && (
                    <button className="search-clear-btn" onClick={() => setQuery('')}>
                        <X size={16} />
                    </button>
                )}
                <button
                    className={`search-mic-btn ${isListening ? 'listening' : ''}`}
                    onClick={handleVoiceSearch}
                    title="Search by voice"
                >
                    <Mic size={18} color={isListening ? "#ef4444" : "currentColor"} />
                </button>
            </div>

            {isFocused && (
                <SearchSuggestions
                    suggestions={suggestions}
                    recentSearches={recentSearches}
                    loading={loading}
                    onSelect={(term) => {
                        setQuery(term);
                        handleSearch(term);
                    }}
                    onRemoveRecent={removeRecent}
                />
            )}
        </div>
    );
};

export default SearchBar;
