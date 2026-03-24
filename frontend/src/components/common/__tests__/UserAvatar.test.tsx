import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserAvatar from '../UserAvatar';

describe('UserAvatar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initials when no emoji saved', () => {
    render(<UserAvatar userId="1" name="John Doe" email="john@test.com" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single-word name', () => {
    render(<UserAvatar userId="2" name="Alice" email="alice@test.com" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders saved emoji from localStorage', () => {
    localStorage.setItem('avatar_3', '🦊');
    render(<UserAvatar userId="3" name="Fox User" email="fox@test.com" />);
    expect(screen.getByText('🦊')).toBeInTheDocument();
  });

  it('respects custom size prop', () => {
    const { container } = render(
      <UserAvatar userId="4" name="Size Test" email="s@test.com" size={60} />
    );
    const avatar = container.querySelector('[style*="width: 60px"]');
    expect(avatar).toBeInTheDocument();
  });

  it('does not show picker when not editable', () => {
    const { container } = render(
      <UserAvatar userId="5" name="No Edit" email="n@test.com" />
    );
    const avatarDiv = container.querySelector('.rounded-full');
    fireEvent.click(avatarDiv!);
    expect(screen.queryByText('Choose Avatar')).not.toBeInTheDocument();
  });

  it('shows picker when editable and clicked', () => {
    const { container } = render(
      <UserAvatar userId="6" name="Editable" email="e@test.com" editable />
    );
    const avatarDiv = container.querySelector('.rounded-full');
    fireEvent.click(avatarDiv!);
    expect(screen.getByText('Choose Avatar')).toBeInTheDocument();
  });

  it('selects emoji and saves to localStorage', () => {
    const { container } = render(
      <UserAvatar userId="7" name="Picker" email="p@test.com" editable />
    );
    fireEvent.click(container.querySelector('.rounded-full')!);
    fireEvent.click(screen.getByText('🐻'));
    expect(localStorage.getItem('avatar_7')).toBe('🐻');
    expect(screen.getByText('🐻')).toBeInTheDocument();
  });

  it('clears emoji and reverts to initials', () => {
    localStorage.setItem('avatar_8', '🌟');
    const { container } = render(
      <UserAvatar userId="8" name="Clear Test" email="c@test.com" editable />
    );
    expect(screen.getByText('🌟')).toBeInTheDocument();
    fireEvent.click(container.querySelector('.rounded-full')!);
    fireEvent.click(screen.getByText('Remove & use initials'));
    expect(localStorage.getItem('avatar_8')).toBeNull();
    expect(screen.getByText('CT')).toBeInTheDocument();
  });
});
