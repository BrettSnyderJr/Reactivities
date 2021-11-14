import React from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
    errors: any;
}

const ValidationErrors = function ({errors}: Props) {
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((err: any, i: any) => {
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