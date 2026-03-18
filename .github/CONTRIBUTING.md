# Contributing to VideoSOS

Thank you for your interest in contributing to VideoSOS! We welcome contributions from the community.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible using the bug report template.

**Good bug reports** include:
- A clear and descriptive title
- Exact steps to reproduce the problem
- Expected vs actual behavior
- Screenshots or logs if applicable
- Your environment (OS, browser, Node.js version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please use the feature request template and provide:
- Clear description of the problem you're trying to solve
- Proposed solution
- Alternative approaches you've considered
- Why this feature would be useful to others

### Asking Questions

For questions about using VideoSOS:
- Check the [documentation](https://github.com/timoncool/videosos#readme) first
- Search [existing discussions](https://github.com/timoncool/videosos/discussions)
- If you still need help, start a new discussion in Q&A

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style of the project
3. **Add tests** if applicable
4. **Ensure tests pass** by running `npm test`
5. **Update documentation** if you changed any functionality
6. **Write a good commit message** describing what and why
7. **Submit a pull request** with a clear description

#### Pull Request Guidelines

- Keep PRs focused on a single issue or feature
- Link related issues in the PR description
- Update relevant documentation
- Add tests for new functionality
- Follow the existing code style
- Ensure CI checks pass

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/videosos.git
cd videosos

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Code Style

- Follow the existing code style
- Use TypeScript types appropriately
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Include both unit and integration tests where appropriate

## Documentation

Good documentation helps everyone:
- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update or create guides for new features
- Keep examples up to date

## Commit Messages

Write clear commit messages:
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and PRs when applicable

Examples:
```
Add video template selection feature

Fix race condition in video generation (#123)

Update Runware API integration
- Remove deprecated models
- Add new model endpoints
- Update documentation
```

## Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release

## Community

- Be respectful and inclusive
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Help others in discussions
- Share your projects and ideas

## Questions?

If you have questions about contributing:
- Check this guide
- Search [Discussions](https://github.com/timoncool/videosos/discussions)
- Ask in the Development category of Discussions

Thank you for contributing to VideoSOS! 🎬
