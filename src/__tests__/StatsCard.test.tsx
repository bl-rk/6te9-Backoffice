import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsCard from '../../components/StatsCard';
import React from 'react';
import { Package } from 'lucide-react';

describe('StatsCard Component', () => {
    it('renders correctly with title and value', () => {
        render(
            <StatsCard
                title="Total Items"
                value={150}
                icon={<Package data-testid="icon" />}
            />
        );

        expect(screen.getByText('Total Items')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('renders trend information when provided', () => {
        render(
            <StatsCard
                title="Revenue"
                value="₦1.2M"
                icon={<Package />}
                trend="+5.4% YoY"
            />
        );

        expect(screen.getByText('+5.4% YoY')).toBeInTheDocument();
    });
});
