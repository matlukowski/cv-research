# Contributing to SaaS Boilerplate

First off, thank you for considering contributing to this project! 🎉

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
- Check if the suggestion already exists
- Provide clear description and use cases
- Explain why it would be useful

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Use TypeScript for type safety
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Ensure all tests pass

### Development Setup

```bash
# Clone your fork
git clone https://github.com/matlukowski/saas-stack

# Install dependencies
pnpm install

# Setup environment
pnpm setup

# Start database
pnpm docker:up

# Run migrations
pnpm db:migrate

# Start dev server
pnpm dev
```

## Questions?

Feel free to open an issue for any questions!