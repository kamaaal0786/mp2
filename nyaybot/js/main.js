// Main chatbot functionality for LEXAI

// Chat history storage
const CHAT_HISTORY_KEY = 'lexai_chat_history';

// Initialize chat
function initializeChat() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    loadChatHistory();
}

// Save chat message
function saveChatMessage(type, message, references = null) {
    const history = getChatHistory();
    const newMessage = {
        id: Date.now().toString(),
        type: type,
        message: message,
        references: references,
        timestamp: new Date().toISOString(),
        userEmail: getCurrentUser().email
    };

    history.push(newMessage);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

// Get chat history
function getChatHistory() {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// Load chat history
function loadChatHistory() {
    const history = getChatHistory();
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;

    const userHistory = history.filter(msg => msg.userEmail === currentUser.email);
    
    if (userHistory.length > 0) {
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('suggestions').style.display = 'none';
        
        userHistory.slice(-20).forEach(msg => {
            addMessageToUI(msg.type, msg.message, msg.references, false);
        });
    }
}

// Clear chat history
function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history?')) {
        const currentUser = getCurrentUser();
        const allHistory = getChatHistory();
        
        // Remove only current user's messages
        const otherUsersHistory = allHistory.filter(msg => msg.userEmail !== currentUser.email);
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(otherUsersHistory));
        
        // Clear UI
        document.getElementById('chatMessages').innerHTML = `
            <div class="empty-state" id="emptyState">
                <div class="empty-icon">⚖️</div>
                <h3 class="empty-title">Welcome to LEXAI</h3>
                <p class="empty-subtitle">
                    Your AI-powered Indian legal assistant. Ask questions about IPC sections, 
                    case analysis, legal precedents, or get help drafting legal documents.
                </p>
            </div>
        `;
        document.getElementById('suggestions').style.display = 'flex';
    }
}

// Add message to UI
function addMessageToUI(type, text, references = null, save = true) {
    const messagesContainer = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const user = getCurrentUser();
    const avatar = type === 'bot' ? '⚖️' : 
                   user.firstName.charAt(0).toUpperCase();
    const sender = type === 'bot' ? 'LEXAI Assistant' : 
                  `${user.firstName} ${user.lastName}`;
    
    let referencesHTML = '';
    if (references && references.length > 0) {
        referencesHTML = `
            <div class="legal-references">
                <h4>📚 Legal References:</h4>
                <ul>
                    ${references.map(ref => `<li>${ref}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${sender}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${text}${referencesHTML}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (save) {
        saveChatMessage(type, text, references);
    }
}

// Legal knowledge base for Indian law
const legalKnowledgeBase = {
    // IPC Sections
    ipc: {
        '302': {
            title: 'Section 302 - Punishment for Murder',
            description: 'Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.',
            references: [
                'Indian Penal Code, 1860 - Section 302',
                'R v. Govinda (1876) - Classic case on murder',
                'State of Maharashtra v. Bharat Fakira Dhiwar (2002)',
                'Bachan Singh v. State of Punjab (1980) - Death penalty guidelines'
            ]
        },
        '498a': {
            title: 'Section 498A - Cruelty by Husband or Relatives',
            description: 'Whoever, being the husband or relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.',
            references: [
                'Indian Penal Code, 1860 - Section 498A',
                'Sushil Kumar Sharma v. Union of India (2005)',
                'Arnesh Kumar v. State of Bihar (2014) - Arrest guidelines',
                'Rajesh Sharma v. State of U.P. (2017)'
            ]
        },
        '420': {
            title: 'Section 420 - Cheating and Dishonestly Inducing Delivery of Property',
            description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
            references: [
                'Indian Penal Code, 1860 - Section 420',
                'State of Maharashtra v. Mayer Hans George (1965)',
                'K.N. Mehra v. State of Rajasthan (1957)',
                'Hridaya Ranjan Prasad Verma v. State of Bihar (2000)'
            ]
        }
    },
    
    // Constitutional Articles
    constitution: {
        '14': {
            title: 'Article 14 - Equality Before Law',
            description: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
            references: [
                'Constitution of India - Article 14',
                'Maneka Gandhi v. Union of India (1978)',
                'E.P. Royappa v. State of Tamil Nadu (1974)',
                'State of West Bengal v. Anwar Ali Sarkar (1952)'
            ]
        },
        '21': {
            title: 'Article 21 - Protection of Life and Personal Liberty',
            description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
            references: [
                'Constitution of India - Article 21',
                'Maneka Gandhi v. Union of India (1978)',
                'Francis Coralie Mullin v. Administrator, UT of Delhi (1981)',
                'K.S. Puttaswamy v. Union of India (2017) - Right to Privacy'
            ]
        },
        '32': {
            title: 'Article 32 - Right to Constitutional Remedies',
            description: 'The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed.',
            references: [
                'Constitution of India - Article 32',
                'Romesh Thappar v. State of Madras (1950)',
                'State of Rajasthan v. Union of India (1977)',
                'Minerva Mills Ltd. v. Union of India (1980)'
            ]
        }
    },
    
    // Landmark Cases
    landmarks: {
        'kesavananda': {
            title: 'Kesavananda Bharati v. State of Kerala (1973)',
            description: 'This landmark 13-judge bench decision established the Basic Structure Doctrine, holding that Parliament cannot alter the basic structure of the Constitution even through constitutional amendments.',
            references: [
                'Kesavananda Bharati v. State of Kerala (1973)',
                'Article 368 - Amendment of the Constitution',
                'Minerva Mills Ltd. v. Union of India (1980)',
                'I.R. Coelho v. State of Tamil Nadu (2007)'
            ]
        },
        'vishaka': {
            title: 'Vishaka v. State of Rajasthan (1997)',
            description: 'This PIL laid down guidelines for prevention of sexual harassment of women at workplace, later codified in the Sexual Harassment of Women at Workplace Act, 2013.',
            references: [
                'Vishaka v. State of Rajasthan (1997)',
                'Sexual Harassment of Women at Workplace Act, 2013',
                'Article 14, 15, 19(1)(g), 21 of Constitution',
                'CEDAW - Convention on Elimination of Discrimination Against Women'
            ]
        }
    }
};

// Get AI response based on user query
function getIntelligentResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check for IPC sections
    const sectionMatch = lowerQuery.match(/section\s*(\d+[a-z]?)/i) || 
                        lowerQuery.match(/(\d+[a-z]?)\s*ipc/i);
    
    if (sectionMatch) {
        const sectionNum = sectionMatch[1];
        if (legalKnowledgeBase.ipc[sectionNum]) {
            const section = legalKnowledgeBase.ipc[sectionNum];
            return {
                text: `<strong>${section.title}</strong><br><br>${section.description}`,
                references: section.references
            };
        }
    }
    
    // Check for constitutional articles
    const articleMatch = lowerQuery.match(/article\s*(\d+)/i);
    if (articleMatch) {
        const articleNum = articleMatch[1];
        if (legalKnowledgeBase.constitution[articleNum]) {
            const article = legalKnowledgeBase.constitution[articleNum];
            return {
                text: `<strong>${article.title}</strong><br><br>${article.description}`,
                references: article.references
            };
        }
    }
    
    // Keyword-based responses
    if (lowerQuery.includes('privacy') || lowerQuery.includes('puttaswamy')) {
        return {
            text: `<strong>Right to Privacy - K.S. Puttaswamy v. Union of India (2017)</strong><br><br>In this historic 9-judge bench decision, the Supreme Court unanimously declared that the Right to Privacy is a fundamental right under Article 21 of the Constitution. The judgment emphasized that privacy includes preservation of personal intimacies, sanctity of family life, marriage, procreation, home, and sexual orientation. It has significant implications for Aadhaar, data protection, surveillance, and individual autonomy.`,
            references: [
                'K.S. Puttaswamy v. Union of India (2017) - 9 Judge Bench',
                'Article 21 - Right to Life and Personal Liberty',
                'Kharak Singh v. State of U.P. (1963)',
                'M.P. Sharma v. Satish Chandra (1954)',
                'Personal Data Protection Bill, 2019'
            ]
        };
    }
    
    if (lowerQuery.includes('basic structure') || lowerQuery.includes('kesavananda')) {
        const landmark = legalKnowledgeBase.landmarks.kesavananda;
        return {
            text: `<strong>${landmark.title}</strong><br><br>${landmark.description}`,
            references: landmark.references
        };
    }
    
    if (lowerQuery.includes('sexual harassment') || lowerQuery.includes('vishaka')) {
        const landmark = legalKnowledgeBase.landmarks.vishaka;
        return {
            text: `<strong>${landmark.title}</strong><br><br>${landmark.description}`,
            references: landmark.references
        };
    }
    
    if (lowerQuery.includes('dowry') || lowerQuery.includes('498')) {
        const section = legalKnowledgeBase.ipc['498a'];
        return {
            text: `<strong>${section.title}</strong><br><br>${section.description}<br><br>Recent Supreme Court guidelines in Arnesh Kumar (2014) and Rajesh Sharma (2017) have emphasized that arrests should not be automatic and proper investigation must be conducted before arrest.`,
            references: section.references
        };
    }
    
    if (lowerQuery.includes('consumer') || lowerQuery.includes('complaint')) {
        return {
            text: `<strong>Consumer Complaints under Consumer Protection Act, 2019</strong><br><br>To file a consumer complaint:<br>
            1. <strong>Jurisdiction:</strong> District Forum (claims up to ₹1 crore), State Commission (₹1-10 crore), National Commission (above ₹10 crore)<br>
            2. <strong>Time Limit:</strong> Within 2 years from cause of action<br>
            3. <strong>Required Details:</strong> Complainant details, opposite party, deficiency/defect, relief sought<br>
            4. <strong>Documents:</strong> Purchase invoice, correspondence, evidence of deficiency<br>
            5. <strong>No Court Fee:</strong> For claims up to ₹5 lakh<br><br>
            The Act provides for compensation for deficiency in service, defective goods, unfair trade practices, and excessive charges.`,
            references: [
                'Consumer Protection Act, 2019',
                'Section 35 - Jurisdiction of District Commission',
                'Section 47 - Jurisdiction of State Commission',
                'Section 58 - Jurisdiction of National Commission',
                'Section 18 - Consumer Disputes Redressal Commission'
            ]
        };
    }
    
    // Default comprehensive response
    return {
        text: `Thank you for your query regarding "${query}".<br><br>I can assist you with:<br>
        • <strong>IPC Sections</strong> - Explanations of Indian Penal Code provisions<br>
        • <strong>Constitutional Law</strong> - Articles and fundamental rights<br>
        • <strong>Landmark Judgments</strong> - Analysis of important Supreme Court cases<br>
        • <strong>Legal Procedures</strong> - Filing complaints, drafting documents<br>
        • <strong>Case Laws</strong> - Precedents and legal principles<br><br>
        Please ask me specific questions about any legal topic, IPC section numbers (e.g., "Section 420"), constitutional articles (e.g., "Article 14"), or landmark cases.`,
        references: [
            'Indian Penal Code, 1860',
            'Constitution of India, 1950',
            'Code of Criminal Procedure, 1973',
            'Code of Civil Procedure, 1908',
            'Indian Evidence Act, 1872'
        ]
    };
}

// Export for use in index.html
if (typeof window !== 'undefined') {
    window.initializeChat = initializeChat;
    window.getChatHistory = getChatHistory;
    window.clearChatHistory = clearChatHistory;
    window.getIntelligentResponse = getIntelligentResponse;
}