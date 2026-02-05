from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

leads = []

def generate_reply(message):
    message = message.lower().strip()
    
    # Main menu options
    if message in ["ask_question", "ask a question", "question"]:
        return "I'd be happy to answer your questions! What would you like to know about?\n\n💰 Pricing\n✨ Features\n🔒 Security\n🔗 Integrations\n🎯 Free Trial"
    
    elif message in ["contact_sales", "contact sales", "sales"]:
        return "Great! I'll collect some information so our team can reach out to you. What's your name?"
    
    elif message in ["learn_more", "learn more", "more info", "information"]:
        return "I'd be happy to tell you more! AmplifyEase offers AI-powered business solutions including:\n\n• Smart Automation\n• Analytics Dashboard\n• Team Collaboration Tools\n• Enterprise Security\n\nWould you like to know about pricing or features?"
    
    elif message in ["main_menu", "main menu", "menu", "home"]:
        return "What would you like to do?\n\n💬 Ask a Question\n📞 Contact Sales\nℹ️ Learn More"
    
    # Pricing questions
    elif message in ["pricing", "price", "cost", "plans"]:
        return "Our pricing starts at $29/month for the basic plan, $79/month for professional, and $149/month for enterprise. All plans include 24/7 support!\n\nIs there anything else I can help you with?\n\n💬 Ask Another Question\n📞 Contact Sales\n🏠 Main Menu"
    
    # Features questions
    elif message in ["features", "feature", "capabilities", "what can it do"]:
        return "AmplifyEase includes powerful features:\n\n📊 Analytics Dashboard - Real-time insights\n🛡️ Secure & Reliable - Enterprise-grade security\n⚙️ Smart Automation - Intelligent workflows\n👥 Team Collaboration - Seamless integration\n\nWhich feature interests you most?"
    
    # Security questions
    elif message in ["security", "secure", "data protection", "privacy"]:
        return "Security is our top priority! We offer:\n\n🔒 End-to-end encryption\n🛡️ SOC 2 Type II certified\n🔐 GDPR compliant\n🚫 Regular security audits\n📋 Detailed audit logs\n\nYour data is always safe with us!"
    
    # Integrations
    elif message in ["integrations", "integration", "connect", "api"]:
        return "We integrate with all your favorite tools:\n\n📧 Email platforms (Gmail, Outlook)\n💬 Chat apps (Slack, Teams)\n📊 Analytics (Google Analytics, Mixpanel)\n💼 CRM (Salesforce, HubSpot)\n🗂️ Storage (Google Drive, Dropbox)\n\nAnd many more!"
    
    # Free trial
    elif message in ["free trial", "trial", "free", "demo", "demo", "book demo"]:
        return "Great choice! Start your 14-day free trial today:\n\n✅ Full access to all features\n✅ No credit card required\n✅ Cancel anytime\n✅ Free onboarding support\n\nReady to get started? I can connect you with our team!"
    
    # Product information
    elif "product" in message:
        return "We offer AI-powered automation tools that help businesses:\n\n• Save time with smart workflows\n• Improve decision-making with analytics\n• Enhance team collaboration\n• Scale operations efficiently\n\nWould you like to see a demo?"
    
    # Support questions
    elif "support" in message or "help" in message:
        return "We're here to help! Our support includes:\n\n🕐 24/7 live chat support\n📧 Email support within 2 hours\n📞 Phone support for Pro+ plans\n📚 Comprehensive knowledge base\n🎓 Free training sessions\n\nHow can I assist you today?"
    
    # General fallback
    else:
        return "I'm here to help! Please choose an option or tell me what you need.\n\n💬 Ask a Question\n📞 Contact Sales\nℹ️ Learn More"

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message")
    reply = generate_reply(user_msg)
    return jsonify({"reply": reply})

@app.route("/save-user", methods=["POST"])
def save_user():
    data = request.json
    leads.append(data)
    print("📥 New Lead:", data)
    return jsonify({"status": "saved"})

@app.route("/")
def home():
    return "Chatbot Backend Running!"

if __name__ == "__main__":
    app.run(debug=True)
