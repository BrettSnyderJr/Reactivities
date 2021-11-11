import React from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
    errors: string[] | null
}

const ValidationErrors = function ({errors}: Props) {
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((err: any, i) => {
                        return(
                            <Message.Item key={i}>
                                {err}
                            </Message.Item>
                        )
                    })}
                </Message.List>
            )}
        </Message>
    );
};

export default ValidationErrors;